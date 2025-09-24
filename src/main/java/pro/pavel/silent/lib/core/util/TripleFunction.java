/*
 * Copyright (c) 2012, 2013, Oracle and/or its affiliates. All rights reserved.
 * ORACLE PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
package pro.pavel.silent.lib.core.util;

@FunctionalInterface
public interface TripleFunction<T, U, V, R> {

    R apply(T t, U u, V v);

}
